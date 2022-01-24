if ! [[ -d "redis" && -x "redis/redis-server" && -x "redis/redis-cli" ]]; then
    mkdir redis &> /dev/null
    cd redis || exit 1

    # Download
    echo -n "Downloading Redis: "
    wget -q 'http://download.redis.io/redis-stable.tar.gz'
    tar xaf redis-stable.tar.gz
    echo "Done"

    # Make
    echo -n "Compiling Redis (takes about 5 mins): "
    cd redis-stable
    if make -j`nproc` &> /dev/null; then
        echo "Done"
    else
        echo "Failed!"
        exit 1
    fi

    # Install and Clean-up
    echo -n "Installing Redis: "
    mv src/redis-server ../
    mv src/redis-cli ../
    cd ..
    rm -rf redis-stable*
    echo "Done"
else
    echo "Redis is installed!"
fi

npm install redis@3.1.2 connect-redis

echo -n "Starting redis: "

./redis/redis-server &>/dev/null &
redis_pid="$!"

if ! [ -z "$redis_pid" ]; then
    echo "Started redis with PID $redis_pid"
else
    echo "Could not start redis!"
    exit 1
fi

echo -n "Starting server: "

node sessions/03-dynamic-redis.js &>/dev/null &
node_pid="$!"

if ! [ -z "$node_pid" ]; then
    echo "Started node with PID $node_pid! Please open localhost:3000 in your browser."
    echo -n "Exit server: Press <enter> to exit... "
    read
    kill $node_pid
    kill $redis_pid
else
    echo "Could not start server!"
    exit 1
fi
