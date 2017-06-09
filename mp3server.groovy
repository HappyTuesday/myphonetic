import com.sun.net.httpserver.*

def port = 1995
def root = new File("songs")
def server = HttpServer.create(new InetSocketAddress(port), 0)

server.createContext("/", { HttpExchange exchange ->
    try {
        def path = exchange.requestURI.path
        println "GET $path"
        def file = new File(root, path.substring(1))
        if (file.exists()) {
            def length = file.length()
            def requestRange = exchange.requestHeaders.getFirst("Range") ?: "bytes=0-"
            requestRange = requestRange.replaceFirst(/^bytes=/, "")
            def startend = requestRange.split('-')
            def start = Long.parseLong(startend[0]), end = Long.parseLong(startend.size() > 1 ? startend[1] : "-1")
            if (end < 0 || end > length - 1) {
                end = length - 1
            }
            def status = start == 0 && end == length - 1 ? 200 : 206

            println "range=$requestRange, start=$start, end=$end, length=$length"

            exchange.responseHeaders.set("Content-Type", "audio/mpeg")
            exchange.responseHeaders.set("Content-Length", (end - start + 1) as String)
            exchange.responseHeaders.set("Content-Range", "bytes=$start-$end/$length")
            exchange.responseHeaders.set("Cache-Control", "no-store")
            exchange.responseHeaders.set("Accept-Ranges", "bytes")
            exchange.sendResponseHeaders(status, 0)
            def canceled = false
            
            file.withInputStream {
                def bufferSize = 4096
                def buffer = new byte[bufferSize]
                def bytesToCopy = end - start + 1
                while (bytesToCopy > 0) {
                    // println "left bytes: $bytesToCopy"
                    it.skip(start)
                    def bytesRead = it.read(buffer)
                    try {
                        if (bytesRead == -1) {
                            break
                        } else if (bytesRead <= bytesToCopy) {
                            exchange.responseBody.write(buffer, 0, bytesRead)
                            bytesToCopy -= bytesRead
                        } else {
                            exchange.responseBody.write(buffer, 0, (int) bytesToCopy)
                            bytesToCopy = 0
                        }
                    } catch (IOException e) {
                        if (e.message == "Broken pipe") {
                            println "canceled by client"
                            canceled = true
                            break
                        } else {
                            throw e
                        }
                    }
                }
                println "copy bytes = ${end - start + 1 - bytesToCopy}"
            }
            if (!canceled)
                exchange.responseBody.close()
        } else {
            exchange.sendResponseHeaders(404, 0)
            exchange.responseBody.close()
        }
    } catch(e) {
        e.printStackTrace()
    }
} as HttpHandler)
server.start()