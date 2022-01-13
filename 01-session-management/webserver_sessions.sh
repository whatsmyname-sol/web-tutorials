npm install --save express-session > /dev/null

echo -n "Installing express-session: "
if [ "$?" -ne 0 ]; then
    echo "npm install failed, please check logs!"
    exit 1
else
    echo "npm install finished successfully!"
fi

echo -n "Starting server: "

node sessions/01-static.js & &>/dev/null
node_pid="$!"

if ! [ -z "$node_pid" ]; then
    echo "Started node with PID $node_pid! Please open localhost:3000 in your browser."
    echo -n "Exit server: Press <enter> to exit... "
    read
    kill $node_pid
else
    echo "Could not start server!"
    exit 1
fi

echo -n "Starting server: "

node sessions/02-dynamic.js & &>/dev/null
node_pid="$!"

if ! [ -z "$node_pid" ]; then
    echo "Started node with PID $node_pid! Please open localhost:3000 in your browser."
    echo -n "Exit server: Press <enter> to exit... "
    read
    kill $node_pid
else
    echo "Could not start server!"
    exit 1
fi
