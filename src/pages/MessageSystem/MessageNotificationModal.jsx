import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MessageList from "./MessageList";
import ConversationModal from "./ConversationModal";
import "./MessageSystem.scss";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { getUserInfoByID } from "../../services/user/getUserInfoByID";
import socket from "../../utils/socket";

const MessageNotificationModal = ({ onClose, unreadInfor, conversations }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  // const [conversations, setConversations] = useState([]);
  const { account } = useContext(AuthContext);
  const [storeAccount, setStoreAccount] = useState({});
  // const [unreadInfor, setUnreadInfor] = useState(null);

  const getStoreAccount = async () => {
    const response = await getUserInfoByID(account?.ID, "store");
    console.log("+++store account:", response);
    setStoreAccount(response);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     socket.emit("count_unread_messages", {
  //       idUser: storeAccount?.ID,
  //       accountId: account.ID,
  //       role: "store",
  //     });
  //     socket.on("unread_messages_count", (unread_messages) => {
  //       console.log("unread_messages_count", unread_messages);
  //       setUnreadInfor(unread_messages);

  //       // status = unread_messages.perConversation.find(
  //       //   (item) => item.ConversationId === conversationId
  //       // ).unreadCount;
  //     });

  //     return () => {
  //       status;
  //       socket.off("unread_messages_count");
  //     };
  //   }
  // }, [isLoggedIn, storeAccount?.ID, account?.ID]);

 

  const filteredMessages = conversations?.filter((message) => {
    // Filter by search query
    const matchesSearch =
      message.Customer.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.Messages.at(-1)
        .Content.toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" &&
        unreadInfor.perConversation.find(
          (item) => item.conversationId === message.ID
        )?.unreadCount > 0);

    return matchesSearch && matchesTab;
  });

  const handleMessageClick = (message) => {
    setSelectedMessage(message);

    socket.emit("mark_messages_read", {
      conversationId: message.ID,
      readerId: account.ID,
    });
    // Lắng nghe khi có tin nhắn mới hoặc cập nhật
    socket.on("message_changed", () => {
      socket.emit("get_store_conversations", { storeId: storeAccount.ID });
    });

    return () => {
      socket.off("message_changed");
    };
  };

  useEffect(() => {
    if (account?.ID) {
      getStoreAccount();
    }
  }, [account?.ID]);

  
  console.log("-----Conversations:", conversations);

  return (
    <>
      {!selectedMessage && (
        <>
          <div className="modal-backdrop" onClick={onClose}></div>
          <div className="message-notification-modal">
            <div className="modal-header">
              <h2>Tin nhắn</h2>
              <button className="close-button" onClick={onClose}>
                <CloseIcon size={20} />
              </button>
            </div>

            <div className="search-container">
              <SearchIcon size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm người nhắn"
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            <div className="tabs">
              <button
                className={`tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => handleTabChange("all")}
              >
                Tất cả
              </button>
              <button
                className={`tab ${activeTab === "unread" ? "active" : ""}`}
                onClick={() => handleTabChange("unread")}
              >
                Chưa đọc
              </button>
            </div>

            <MessageList
              messages={filteredMessages}
              onMessageClick={handleMessageClick}
              unreadInfor={unreadInfor}
            />
          </div>
        </>
      )}

      {selectedMessage && (
        <ConversationModal
          message={selectedMessage}
          onClose={onClose}
          conversations={conversations}
          unreadInfor={unreadInfor}
          idStore={storeAccount?.ID}
          idAccount={account?.ID}
        />
      )}
    </>
  );
};

export default MessageNotificationModal;
