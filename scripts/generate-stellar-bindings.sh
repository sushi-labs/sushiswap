#!/bin/bash

# Script to generate Stellar TypeScript bindings
# Usage: ./generate-stellar-bindings.sh <contract-id> <directory-name>

CONTRACT_ID=$1
DIR_NAME=$2

# Check if both arguments are provided
if [ -z "$CONTRACT_ID" ] || [ -z "$DIR_NAME" ]; then
  echo "Error: Missing required arguments"
  echo "Usage: $0 <contract-id> <directory-name>"
  echo "Example: $0 CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC xlm"
  exit 1
fi

echo "Generating Stellar TypeScript bindings..."
echo "Contract ID: $CONTRACT_ID"
echo "Output directory: packages/stellar/src/$DIR_NAME"

# Create a temporary directory for the generated bindings
TEMP_DIR=$(mktemp -d)

# Generate the bindings to temporary directory
stellar contract bindings typescript \
  --network testnet \
  --contract-id "$CONTRACT_ID" \
  --output-dir "$TEMP_DIR" \
  --overwrite

if [ $? -eq 0 ]; then
  echo "✅ Bindings generated successfully!"

  # Check if the generated index.ts file exists
  if [ -f "$TEMP_DIR/src/index.ts" ]; then
    echo "📦 Extracting and organizing files..."

    # Create the target directory
    mkdir -p "packages/stellar/src/$DIR_NAME"

    # Move the index.ts file to the target location
    mv "$TEMP_DIR/src/index.ts" "packages/stellar/src/$DIR_NAME/index.ts"

    # Clean up the temporary directory (delete all files except the one we moved)
    rm -rf "$TEMP_DIR"

    echo "✅ Files organized successfully!"

    # Update package.json to add the new export
    echo "📝 Updating package.json exports..."

    # Use node to update the package.json
    node -e "
      const fs = require('fs');
      const dirName = process.argv[1];
      const pkg = JSON.parse(fs.readFileSync('packages/stellar/package.json', 'utf8'));
      pkg.exports['./' + dirName] = {
        types: './dist/' + dirName + '/index.d.ts',
        import: './dist/' + dirName + '/index.js',
        require: './dist/' + dirName + '/index.js'
      };
      fs.writeFileSync('packages/stellar/package.json', JSON.stringify(pkg, null, 2) + '\n');
    " "$DIR_NAME"

    echo "✅ package.json updated!"

    # Build the stellar package
    echo "🔨 Building TypeScript project..."
    cd packages/stellar
    pnpm build

    if [ $? -eq 0 ]; then
      echo "✅ Build completed successfully!"

      # Install dependencies from root to update workspace
      echo "📦 Updating workspace dependencies..."
      cd ../..
      pnpm install

      if [ $? -eq 0 ]; then
        echo "🚀 All done! The new bindings are ready to use."
        echo "You can now import from '@sushiswap/stellar/$DIR_NAME'"
      else
        echo "❌ Workspace dependency update failed!"
        exit 1
      fi
    else
      echo "❌ Build failed!"
      exit 1
    fi
  else
    echo "❌ Generated index.ts file not found in $TEMP_DIR/src/!"
    rm -rf "$TEMP_DIR"
    exit 1
  fi
else
  echo "❌ Bindings generation failed!"
  exit 1
fi
