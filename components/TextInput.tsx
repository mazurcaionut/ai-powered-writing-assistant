"use client";

import { rewrite } from "@/app/actions";
import { useState, useReducer, Reducer, useCallback, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { MdDelete as DeleteIcon } from "react-icons/md";

type State = {
    content: string;
    tone: string;
    length: string;
};

type Action =
    | { type: "UPDATE_CONTENT"; payload: string }
    | { type: "UPDATE_TONE"; payload: string }
    | { type: "UPDATE_LENGTH"; payload: string }
    | { type: "RESET" };

interface HistoryItem {
    content: string;
    tone: string;
    length: string;
    rewrittenContent: string;
    explanation: string;
}

const initialState = {
    content: "",
    tone: "",
    length: "",
};

const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_CONTENT":
            return { ...state, content: action.payload };
        case "UPDATE_TONE":
            return { ...state, tone: action.payload };
        case "UPDATE_LENGTH":
            return { ...state, length: action.payload };
        case "RESET":
            return initialState;
        default:
            return state;
    }
};

const TextInput = () => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [{ content, tone, length }, dispatch] = useReducer(
        reducer,
        initialState
    );

    const { pending } = useFormStatus();

    const handleDownload = () => {
        const data = JSON.stringify(history);
        const blob = new Blob([data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "history.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSubmit = useCallback(async () => {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("tone", tone);
        formData.append("length", length);

        const output = await rewrite(formData);

        setHistory((prevHistory) => [
            ...prevHistory,
            {
                content,
                tone,
                length,
                rewrittenContent: output?.rewrittenContent as string,
                explanation: output?.explanation as string,
            },
        ]);

        dispatch({ type: "RESET" });
    }, [content, tone, length]);

    useEffect(() => {
        const fetchStoredHistory = async () => {
            setLoading(true);
            try {
                const storedHistory = localStorage.getItem("history");
                if (storedHistory) {
                    setHistory(JSON.parse(storedHistory));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStoredHistory();
    }, []);

    // useEffect(() => {
    //     const storedHistory = localStorage.getItem("history");
    //     if (storedHistory) {
    //         setHistory(JSON.parse(storedHistory));
    //     }
    // }, []);

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    return (
        <>
            <textarea
                className="border border-black p-2"
                name="content"
                value={content}
                onChange={(e) =>
                    dispatch({
                        type: "UPDATE_CONTENT",
                        payload: e.target.value,
                    })
                }
            />
            <div className="flex gap-5">
                <label>
                    <input
                        type="radio"
                        name="tone"
                        value="formal"
                        checked={tone === "formal"}
                        onChange={(e) =>
                            dispatch({
                                type: "UPDATE_TONE",
                                payload: e.target.value,
                            })
                        }
                    />
                    Formal
                </label>
                <label>
                    <input
                        type="radio"
                        name="tone"
                        value="casual"
                        checked={tone === "casual"}
                        onChange={(e) =>
                            dispatch({
                                type: "UPDATE_TONE",
                                payload: e.target.value,
                            })
                        }
                    />
                    Casual
                </label>
                <label>
                    <input
                        type="radio"
                        name="tone"
                        value="persuasive"
                        checked={tone === "persuasive"}
                        onChange={(e) =>
                            dispatch({
                                type: "UPDATE_TONE",
                                payload: e.target.value,
                            })
                        }
                    />
                    Persuasive
                </label>
            </div>
            <div className="flex gap-5">
                <label>
                    <input
                        type="radio"
                        name="length"
                        value="shorter"
                        checked={length === "shorter"}
                        onChange={(e) =>
                            dispatch({
                                type: "UPDATE_LENGTH",
                                payload: e.target.value,
                            })
                        }
                    />
                    Shorter
                </label>
                <label>
                    <input
                        type="radio"
                        name="length"
                        value="longer"
                        checked={length === "longer"}
                        onChange={(e) =>
                            dispatch({
                                type: "UPDATE_LENGTH",
                                payload: e.target.value,
                            })
                        }
                    />
                    Longer
                </label>
                <label>
                    <input
                        type="radio"
                        name="length"
                        value="concise"
                        checked={length === "concise"}
                        onChange={(e) =>
                            dispatch({
                                type: "UPDATE_LENGTH",
                                payload: e.target.value,
                            })
                        }
                    />
                    Concise
                </label>
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={pending}
                onClick={handleSubmit}
            >
                Rewrite
            </button>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div className="gap-2 flex flex-col">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleDownload}
                    >
                        Download history
                    </button>
                    {history.length > 0 && <h2>History</h2>}
                    {history.map((item, index) => (
                        <div
                            key={index}
                            className="flex border border-black gap-4 items-center justify-between"
                        >
                            <div>
                                <p>{item.content}</p>
                                <p>{item.rewrittenContent}</p>
                                <p>{`Explanation: ${item.explanation}`}</p>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Show explanation
                                </button>
                            </div>
                            <DeleteIcon
                                className="cursor-pointer"
                                onClick={() =>
                                    setHistory(
                                        history.filter((_, i) => i !== index)
                                    )
                                }
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default TextInput;
