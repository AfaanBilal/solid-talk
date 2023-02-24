/**
 * #solid-tak
 *
 * @author Afaan Bilal https://afaan.dev
 * @link   https://afaan.dev/solid-talk
 */

import { Component, createSignal, createEffect, createResource, For } from "solid-js";

const fetchUsers = async () => (await fetch("https://randomuser.me/api/?results=15&seed=solid")).json();

const me = "1a319ee3-d18f-4ad2-862f-ba801a2e2962";

type User = {
    login: {
        uuid: string;
    };
    picture: {
        large: string;
    };
    name: {
        first: string;
        last: string;
    };
};

type Message = {
    text: string;
    userUuid: string;
    ts: Date;
};

const sampleMessages: Message[] = [
    {
        userUuid: "0d490c4b-9177-45c6-a0ad-451359724bd0",
        text: "Hello, world!",
        ts: new Date(),
    },
    {
        userUuid: me,
        text: "Hello, world!",
        ts: new Date(),
    },
    {
        userUuid: me,
        text: "Goodbye, world!",
        ts: new Date(),
    },
    {
        userUuid: "0d490c4b-9177-45c6-a0ad-451359724bd0",
        text: "Goodbye, world!",
        ts: new Date(),
    },
];

const App: Component = () => {
    const [userCall] = createResource("users", fetchUsers);

    const [messages, setMessages] = createSignal<Message[]>([...sampleMessages]);
    const getUser = (uuid: string) => userCall().results.find((u: User) => u.login.uuid === uuid);

    const [msg, setMsg] = createSignal("");

    const keyUp = (e: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element; }) => {
        if (e.key === "Enter") {
            setMessages([...messages(), { text: msg(), userUuid: me, ts: new Date() }]);
            setMsg("");
        } else {
            setMsg(e.currentTarget.value);
        }
    };

    return (
        <div class="h-full flex text-white font-mono">
            <aside class="h-screen sticky top-0 overflow-hidden hover:overflow-auto border-r border-gray-600">
                <div class="border-b border-gray-600 p-8 text-5xl font-extrabold">#solid-talk</div>
                <div class="flex-1 flex flex-col">
                    <h2 class="py-4 text-center text-lg text-slate-500 border-b border-slate-800">Who else is here?</h2>
                    <div class="flex-1">
                        {userCall.loading ?
                            <div class="text-center p-4">Loading...</div> :
                            <For each={userCall().results}>
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
                <div class="flex-1 flex flex-col justify-end">
                    {!userCall.loading &&
                        <For each={messages()}>
                            {m =>
                                <div class={`flex ${m.userUuid === me ? "flex-row-reverse" : "bg-gray-900"} px-4 py-6 items-center border-t border-b border-slate-800`}>
                                    <img
                                        class="w-16 h-16 rounded-full m-2"
                                        src={getUser(m.userUuid).picture.large}
                                    />
                                    <div class="mx-4 text-lg">
                                        <div class="text-slate-300">{m.text}</div>
                                        <div class={`text-xs text-slate-500 ${m.userUuid === me ? "text-right" : ""}`}>{m.ts.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}</div>
                                    </div>
                                </div>
                            }
                        </For>
                    }
                </div>
                <div class="w-full">
                    <input
                        type="text"
                        class="w-full py-2 px-4 bg-gray-700 h-16 text-xl text-slate-300 font-light focus:outline-none focus:bg-slate-700 placeholder:text-gray-500"
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
