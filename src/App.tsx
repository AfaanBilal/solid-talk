/**
 * #solid-talk
 *
 * @author Afaan Bilal https://afaan.dev
 * @link   https://afaan.dev/solid-talk
 */

import { Component, createSignal, createResource, For, onMount, onCleanup, createEffect } from "solid-js";
import io from "socket.io-client";

const fetchImaginaryUsers = async () => (await (await fetch("https://randomuser.me/api/?results=5&seed=solid-talk")).json()).results;
const defaultAvatar = "data:image/png;base64,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";

type User = {
    id: string;
    name: string;
    avatar: string;
};

type Message = {
    text: string;
    userId: string;
    ts: Date;
};

const socket = io("https://solid-talk-server.onrender.com", { autoConnect: false });

const App: Component = () => {
    const [imaginaryUsers] = createResource("users", fetchImaginaryUsers);
    const [users, setUsers] = createSignal<User[]>([]);
    const [me, setMe] = createSignal("");
    const getUser = (id: string) => users().find((u: User) => u.id === id);

    const [userName, setUserName] = createSignal("");
    const [userAvatar, setUserAvatar] = createSignal("");

    const [messages, setMessages] = createSignal<Message[]>([]);

    const [isConnected, setIsConnected] = createSignal(socket.connected);

    onMount(() => {
        socket.on("connect", () => {
            setIsConnected(true);
            setMe(socket.id);
            socket.emit("user-updated", { id: socket.id, name: userName(), avatar: userAvatar() });
        });
        socket.on("disconnect", () => setIsConnected(false));
        socket.on("users", u => setUsers(u));

        socket.on("message", m => {
            setMessages(p => [...p, m]);
            window.scrollTo(0, document.body.scrollHeight);
        });

        createEffect(() => socket.emit("user-updated", { id: socket.id, name: userName(), avatar: userAvatar() }));
    });

    onCleanup(() => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("pong");
    });

    const toggleConnection = () => {
        if (userName().trim() === "") {
            alert("Please enter a name.");
            return;
        }

        socket.connected ? socket.disconnect() : socket.connect();
    };

    const [msg, setMsg] = createSignal("");

    const keyUp = (e: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element; }) => {
        if (e.key === "Enter") {
            socket.emit("message", { text: msg(), userId: me(), ts: new Date() });
            setMsg("");
        } else {
            setMsg(e.currentTarget.value);
        }
    };

    return (
        <div class="h-full flex text-white font-mono">
            <aside class="h-screen sticky top-0 overflow-hidden hover:overflow-auto border-r border-gray-600">
                <div class="border-b border-gray-600 p-8 text-5xl font-extrabold">
                    #solid-talk
                    <div class="text-sm mt-4 text-right">
                        by <a href="https://afaan.dev" target="_blank" rel="noopener" class="text-cyan-600">Afaan Bilal</a>
                    </div>
                </div>
                <div class="flex-1 flex flex-col">
                    <h2 class="py-4 text-center text-lg text-slate-500 border-b border-slate-800">Who else is here?</h2>
                    <div class="mb-8">
                        <h2 class="mt-4 py-2 border-b border-slate-700 text-slate-400 text-center text-2xl">#real</h2>
                        <For each={users()}>
                            {u =>
                                <div class="flex px-6 py-4 border-b border-slate-600 gap-4">
                                    <img class="w-12 h-12 rounded-full" src={u.avatar || defaultAvatar} />
                                    <div class="flex-1">
                                        {u.name}<br />
                                        <span class="text-sm text-slate-500">{u.id}</span>
                                    </div>
                                </div>
                            }
                        </For>
                    </div>
                    <div class="flex-1">
                        <h2 class="mt-4 py-2 border-b border-slate-700 text-slate-400 text-center text-2xl">#imaginary</h2>
                        {imaginaryUsers.loading ?
                            <div class="text-center p-4">Loading...</div> :
                            <For each={imaginaryUsers()}>
                                {u =>
                                    <div class="flex px-6 py-4 border-b border-slate-600 gap-4">
                                        <img class="w-12 h-12 rounded-full" src={u.picture.large} />
                                        <div class="flex-1">
                                            {u.name.first + " " + u.name.last}<br />
                                            <span class="text-sm text-slate-500">{u.login.username}</span>
                                        </div>
                                    </div>
                                }
                            </For>
                        }
                    </div>
                </div>
            </aside>
            <div class="flex-1 flex flex-col">
                <div class="flex border-b border-slate-600 items-center bg-gray-700">
                    <div class="w-1/3 border-r border-slate-600">
                        <input type="text" class="w-full pl-8 p-4 bg-gray-700 text-lg focus:outline-none" placeholder="Name" value={userName()} onInput={e => setUserName(e.currentTarget.value)} />
                    </div>
                    <div class="flex-1 flex pl-4 items-center border-r border-slate-600">
                        <img src={userAvatar() || defaultAvatar} class="w-12 h-12 rounded-full" alt="avatar" />
                        <input type="url" class="w-full pl-8 p-4 bg-gray-700 text-lg focus:outline-none" placeholder="Avatar URL" value={userAvatar()} onInput={e => setUserAvatar(e.currentTarget.value)} />
                    </div>
                    <div class="px-4 border-r border-slate-600">
                        <button class="px-4 py-2 bg-slate-800 hover:bg-slate-600 rounded" onClick={toggleConnection}>{isConnected() ? "Leave" : "Join"}</button>
                    </div>
                    <div class="px-4">{isConnected() ? "🟢 Connected" : "🔴 Disconnected"}</div>
                </div>
                <div class="flex-1 flex flex-col justify-end">
                    {!imaginaryUsers.loading &&
                        <For each={messages()}>
                            {m =>
                                <div class={`flex ${m.userId === me() ? "flex-row-reverse" : "bg-gray-900"} px-4 py-6 items-center border-t border-b border-slate-800`}>
                                    <img
                                        class="w-16 h-16 rounded-full m-2"
                                        src={getUser(m.userId)?.avatar || defaultAvatar}
                                    />
                                    <div class="mx-4 text-lg">
                                        <div class="text-slate-300">{m.text}</div>
                                        <div class={`text-xs text-slate-500 ${m.userId === me() ? "text-right" : ""}`}>{new Date(m.ts).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}</div>
                                    </div>
                                </div>
                            }
                        </For>
                    }
                </div>
                <div class="w-full flex bg-gray-700 items-center p-2">
                    {!imaginaryUsers.loading && <img class="w-16 h-16 rounded-full" src={userAvatar() || defaultAvatar} />}
                    <input
                        type="text"
                        class="w-full h-16 py-2 px-4 bg-gray-700 text-xl text-slate-300 font-light focus:outline-none focus:bg-slate-700 placeholder:text-gray-500"
                        placeholder="Enter your message here..."
                        value={msg()}
                        onKeyUp={keyUp}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
