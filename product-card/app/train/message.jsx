// const [chatMessages, setChatMessages] = useState([
//     { id: 1, sender: "John D.", text: "Hi! I'm interested in your vintage camera.", timestamp: "2 hours ago" },
//     { id: 2, sender: "You", text: "Great! I'd be happy to swap it. What are you offering?", timestamp: "1 hour ago" },
//     { id: 3, sender: "John D.", text: "I have a smartphone in excellent condition. Would that work?", timestamp: "45 minutes ago" }
//   ]);


// const handleSendMessage = () => {
//     if (message.trim()) {
//       const newMessage = {
//         id: chatMessages.length + 1,
//         sender: "You",
//         text: message,
//         timestamp: "now"
//       };
//       setChatMessages([...chatMessages, newMessage]);
//       setMessage("");
//     }
//   };

        {/* Chat Section */}
   <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat with Swap Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40 w-full border rounded-md p-4 mb-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-lg p-3 ${
                      msg.sender === 'You' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted'
                    }`}>
                      <div className="text-sm font-medium mb-1">{msg.sender}</div>
                      <div className="text-sm">{msg.text}</div>
                      <div className="text-xs opacity-70 mt-1">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>



