#!/bin/sh

GET_BLOCKHAIN() {
    return $(curl --write-out '%{http_code}' --silent --output /dev/null http://localhost:8545)
}

GET_BLOCKHAIN
status=$?

until [ $status == 200 ]
do
    echo "Blockchain is unavailable..."
    GET_BLOCKHAIN
    status=$?
    sleep 2
done

echo "Blockchain detected!"