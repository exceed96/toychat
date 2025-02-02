import { useRef } from "react";
import { ChatSocket } from "../../util/ChatSocket";
import { nanoid } from "nanoid";

export default function ChatInput() {
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const sendMessageHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!localStorage.getItem("id")) {
      localStorage.setItem("id", nanoid());
    }

    if (messageRef.current) {
      const trimmedMessage = messageRef.current.value.trim();
      if (trimmedMessage) {
        ChatSocket.emit("chatting", {
          nickname: localStorage.getItem("nickname"),
          message: trimmedMessage,
          sendUserId: localStorage.getItem("id"),
        });
      }
      messageRef.current.value = "";
      messageRef.current.focus();
    }
  };

  const pressEnterHandler = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler(e);
    }
  };

  const messageInputHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
  };

  return (
    <form
      className="w-full flex gap-2"
      onSubmit={sendMessageHandler}
      onKeyDown={pressEnterHandler}
    >
      <textarea
        placeholder="메세지를 입력하세요"
        className="outline-none w-[80%] font-[HANBatang] pt-2 pb-2 pl-2 rounded-[8px] border-[1px] border-black resize-none"
        ref={messageRef}
        rows={1}
        maxLength={500}
        autoFocus={true}
        onKeyDown={messageInputHandler}
      />
      <button className="bg-black font-[HANBatang] text-white text-sm w-[20%] rounded-[8px] px-5">
        전송
      </button>
    </form>
  );
}
