package dev.kakarot.notifysensei

import android.app.Application
import com.onesignal.OneSignal

const val ONESIGNAL_APP_ID = ""

class NotifySensei : Application() {
    override fun onCreate() {
        super.onCreate()
        OneSignal.setLogLevel(OneSignal.LOG_LEVEL.VERBOSE, OneSignal.LOG_LEVEL.NONE)

        // OneSignal Initialization
        OneSignal.initWithContext(this)
        OneSignal.setAppId(ONESIGNAL_APP_ID)
    }
}