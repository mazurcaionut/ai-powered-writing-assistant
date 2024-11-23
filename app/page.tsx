import TextInput from "@/components/TextInput";

export default function Home() {
    return (
        <div className="w-screen h-screen flex justify-center items-center flex-col gap-5">
            <h1>AI-Powered Writing Assistant</h1>
            <TextInput />
        </div>
    );
}
