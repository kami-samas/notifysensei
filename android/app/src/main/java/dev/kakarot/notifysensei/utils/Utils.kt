package dev.kakarot.notifysensei.utils

import dev.kakarot.notifysensei.R
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import android.content.Context

fun makeHttpPostRequest(context: Context, url: String, jsonBody: JSONObject): String {
    try {
        val url = URL(url)
        val connection = url.openConnection() as HttpURLConnection

        connection.requestMethod = "POST"
        connection.doOutput = true
        connection.setRequestProperty("Content-Type", "application/json")

        val outputStream = connection.outputStream
        outputStream.write(jsonBody.toString().toByteArray())
        outputStream.flush()
        outputStream.close()

        val responseCode = connection.responseCode
        return if (responseCode == 200) {
            val inputStream = connection.inputStream
            val response = inputStream.bufferedReader().use { it.readText() }
            val jsonResponse = JSONObject(response)
            jsonResponse.getString("id")
        } else if (responseCode == 400) {
            val inputStream = connection.inputStream
            val response = inputStream.bufferedReader().use { it.readText() }
            val jsonResponse = JSONObject(response)
            jsonResponse.getString("message")
        } else {
            context.getString(R.string.util_post_err_rs)
        }
    } catch (e: Exception) {
        return "${e.message}"
    }
}