echo opening connection...
adb -s 05250259C5002212 reverse tcp:8081 tcp:8081
echo starting bundler...
yarn start