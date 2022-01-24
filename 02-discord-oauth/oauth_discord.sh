if ! [ -f "config.json" ]; then
    echo "Please create the config.json file using config.example.json file!" && exit 1
fi
key='clientId' && if [[ $(cat config.json | jq --raw-output ".$key // empty") = "" ]] ; then
    echo "Please set '$key' in config.json!" && exit 1
fi
key='clientSecret' && if [[ $(cat config.json | jq --raw-output ".$key // empty") = "" ]] ; then
    echo "Please set '$key' in config.json!" && exit 1
fi
echo "Configuration file found"

echo "Run oauth_implicit.sh next!"
