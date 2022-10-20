#!/usr/bin/env sh

# download antlr4
ANTLR_JAR="antlr4.jar"
if [ ! -e "$ANTLR_JAR" ]; then
  curl https://www.antlr.org/download/antlr-4.7.1-complete.jar -o "$ANTLR_JAR"
fi

# build grammar based on solidity-antlr4 submodule
cd ./solidity-antlr4; java -jar ../$ANTLR_JAR ./Solidity.g4 -Dlanguage=JavaScript -o ../lib/grammar; cd - > /dev/null

# cleanup
rm lib/grammar/*.interp antlr4.jar
