npm install express

npm install ejs

echo -n "Starting server: "

node src/implicit/server.js & &>/dev/null
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
