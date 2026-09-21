import "./Sidebar.css";
import { useContext, useEffect} from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";
import { BaseUrl } from "./config.js";
import blacklogo from "./assets/blacklogo.png";


function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setCurrThreadId,
    setPrevChats,
    setNewChat,
    setPrompt,
    setReply,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/threads`);
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);

    } catch (error) {
      console.error("Error fetching threads:", error);
      console.log(error);
    }
  };

  useEffect(() => {
        getAllThreads();
        
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${BaseUrl}/api/threads/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res.messages || []);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }  
    
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${BaseUrl}/api/threads/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }


  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
       <img src={blacklogo} alt="gpt logo" className="logo" />
        <span>
          {" "}
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads.map((thread, idx) => (
          <li
            key={idx}
            onClick={(e) => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : " "}
          >
            {thread.title}
            <i
              key={idx}
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>
      <div className="sign">
        <p>By Anuj Verma &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
