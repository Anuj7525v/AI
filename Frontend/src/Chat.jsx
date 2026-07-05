import "./Chat.css";
import React, {useContext, useState, useEffect} from "react";
import {MyContext} from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

/*
function Chat(){
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [ lastestReply, setLatestReply] = useState(null);

    useEffect( () => {
        if(reply === null){
            setLatestReply(null);
            return;
        }

        if(!prevChats?.length) return;
        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])
    
  return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}
            <div className="chats">
                {
                    
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                    
                    
                }

                {
                    prevChats.length > 0  && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"} >
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"} >
                                     <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                </div>
                                )

                            }
                        </>
                    )
                }

            </div>
        </>
    )
}

*/


function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (!reply) {
      setLatestReply(null);
      return;
    }

    const words = reply.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      setLatestReply(words.slice(0, index + 1).join(" "));
      index++;

      if (index >= words.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [reply]);

  return (
    <>
      {newChat && <h1>Start a New Chat!</h1>}

      <div className="chats">
        {Array.isArray(prevChats) &&
          prevChats.slice(0, -1).map((chat, idx) => (
            <div
              key={idx}
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
            >
              {chat.role === "user" ? (
                <p className="userMessage">{chat.content}</p>
              ) : (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              )}
            </div>
          ))}

        {Array.isArray(prevChats) &&
          prevChats.length > 0 &&
          prevChats[prevChats.length - 1] && (
            <div className="gptDiv">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {latestReply ?? prevChats[prevChats.length - 1].content}
              </ReactMarkdown>
            </div>
          )}
      </div>
    </>
  );
}


export default Chat;