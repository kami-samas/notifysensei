package dev.kakarot.notifysensei

import android.app.Application
import com.onesignal.OneSignal

const val ONESIGNAL_APP_ID = "c9e94e37-f824-4708-a290-b6aaa8f4f7aa"

class NotifySensei : Application() {
    override fun onCreate() {
        super.onCreate()
        OneSignal.setLogLevel(OneSignal.LOG_LEVEL.VERBOSE, OneSignal.LOG_LEVEL.NONE)

        // OneSignal Initialization
        OneSignal.initWithContext(this)
        OneSignal.setAppId(ONESIGNAL_APP_ID)
    }
}