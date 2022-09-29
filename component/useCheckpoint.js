import * as Network from 'expo-network';
import { Toast } from 'native-base';
// import

export default function useCheckpoint(failed, success, payload) {

    const checkPoint = async () => {
        const { isConnected, isInternetReachable } = await Network.getNetworkStateAsync()
        const airplane = await Network.isAirplaneModeEnabledAsync()
        // const unsubscribe = NetInfo.addEventListener(state => {
        //     console.log("Connection type", state.type);
        //     console.log("Is connected?", state.isConnected);
        // });
        if (airplane) {
            Toast.show(
                {
                    text: `Offline mode`,
                    buttonText: 'CLOSE',
                    type: "danger"
                }
            )
            return failed(payload)
        } else if (!isConnected || !isInternetReachable) {
            console.log('no network')
            return failed(payload)
        } else {
            console.log(isConnected, ' is the value for isConnected')
            console.log(isInternetReachable, ' is the value for isInternetReachable')
            return success(payload)
        }
    }
}
