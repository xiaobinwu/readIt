/**
 * Toast service
 * @file 权限服务
 * @module app/services/location
 * @author twenty-four K <https://github.com/xiaobinwu>
 * @descriptionx 开启权限 https://reactnativecode.com/react-native-runtime-permissionsandroid/
 */

import Geolocation from 'react-native-geolocation-service';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { appName } from '@app/config';
import { showToast } from '@app/services/toast';

export enum IOSPermissions {
    GRANTED = 'granted',
    DENIED = 'denied',
    DISABLED = 'disabled',
}
class Location {
    // 判断IOS是否有获取位置权限
    async hasLocationPermissionIOS(): Promise<boolean> {
        const openSetting = () => {
            Linking.openSettings().catch(() => {
                Alert.alert('Unable to open settings');
            });
        };
        const status = await Geolocation.requestAuthorization('whenInUse');
        if (status === IOSPermissions.GRANTED) {
            return true;
        }
        if (status === IOSPermissions.DENIED) {
            Alert.alert('Location permission denied');
        }
        if (status === IOSPermissions.DISABLED) {
            Alert.alert(
                `Turn on Location Services to allow "${appName}" to determine your location.`,
                '',
                [
                    { text: 'Go to Settings', onPress: openSetting },
                    { text: "Don't Use Location", onPress: () => {} },
                ],
            );
        }
        return false;
    }

    // 判断Android是否有获取位置权限
    async hasLocationPermissionAndroid(): Promise<boolean> {
        if (Platform.OS === 'android' && Platform.Version < 23) {
            return true;
        }
        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (hasPermission) {
            return true;
        }
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }
        if (status === PermissionsAndroid.RESULTS.DENIED) {
            showToast('Location permission denied by user.');
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            showToast('Location permission revoked by user.');
        }
        return false;
    }
    // 判断是否有获取位置权限
    async hasLocationPermission(): Promise<boolean> {
        if (Platform.OS === 'ios') {
            const hasIOSPermission = await this.hasLocationPermissionIOS();
            return hasIOSPermission;
        }
        if (Platform.OS === 'android') {
            const hasAndroidPermission = await this.hasLocationPermissionAndroid();
            return hasAndroidPermission;
        }
        return false;
    }

    // 获取位置信息
    async getLocation(successCallback: (arg0: Geolocation.GeoPosition) => void, errorCallback?: (arg0: Geolocation.GeoError) => void, options?: Geolocation.GeoOptions | undefined) {
        debugger;
        const hasLocationPermission: boolean = await this.hasLocationPermission();

        if (!hasLocationPermission) {
          return;
        }
    
        Geolocation.getCurrentPosition(
            (position) => {
                successCallback(position);
            },
            (error) => {
                errorCallback && errorCallback(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
              distanceFilter: 0,
              forceRequestLocation: true,
              showLocationDialog: true,
              ...options
            },
          );
    }
}

export default new Location();

