def hello(event, ctx):
    return {
    "statusCode": 200,
    "headers": { "Content-Type": "text/plain" },
    "body": f"Moshi moshi from python {event['path']}",
}
