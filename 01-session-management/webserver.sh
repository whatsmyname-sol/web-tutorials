echo -n "Testing node: "
if type -P node > /dev/null; then
    echo "Node.js seems to be correctly installed!"
else
    echo "Node.js command not found, please ensure it is installed and in your path!"
    exit 1
fi

echo -n "Initializing project: "
npm init -y >/dev/null
if [ -f "package.json" ]; then
    echo "Found package.json!"
fi

npm install --save express >/dev/null

echo -n "Installing express: "
if [ "$?" -ne 0 ]; then
    echo "npm install failed, please check logs!"
    exit 1
else
    echo "npm install finished successfully!"
fi

echo -n "Starting server: "
node hello_world/index.js & &>/dev/null
node_pid="$!"
echo "Started node with PID $node_pid! Please open localhost:3000 in your browser."

echo -n "Testing server (sleep 5 seconds): " && sleep 5

if [ "$(curl localhost:3000 2>/dev/null)" = "Hello World!" ]; then
    echo "Server is running correctly!"
else
    echo "Server is not running!"
fi

if ! [ -z "$node_pid" ]; then
    echo -n "Exit server: Press <enter> to exit... "
    read
    kill $node_pid
fi
