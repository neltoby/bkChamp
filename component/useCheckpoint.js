import * as Network from 'expo-network';
import { Toast } from 'native-base';
// import

export default function useCheckpoint(failed, success, payload) {

    const checkPoint = async () => {
        const { isConnected, isInternetReachable } = await Network.getNetworkStateAsync()
        const airplane = await Network.isAirplaneModeEnabledAsync()
        // const unsubscribe = NetInfo.addEventListener(state => {
        //     null
        //     null
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
            return failed(payload)
        } else {
            return success(payload)
        }
    }
}
