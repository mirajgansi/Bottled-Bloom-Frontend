import LoginForm from "../_componets/LoginForm";
export default function Page() {
    return (
        <div className="space-y-6 w-full  ">
            <div className="left text-left">
                <h1 className="text-2xl font-semibold ">Loging</h1>
                <p className="mt-1 text-sm text-gray/70 ">Enter your emails and password</p>
            </div>
            <LoginForm />
        </div>
    );
}