import Link from "next/link"

export default function LoginForm() {
    return (<div className="grid  place-items-center h-screen">
        <div className = "shadow-lg p-5 rounded-lg border-4 border-green-400">
            <h1 className="text-xl font-bold my-4">Enter the details</h1>
            <form className="flex flex-col gap-3">
                <input type="text" placeholder="First Name"></input> 
                <input type="text" placeholder="Last Name"></input>
                <input type="email" placeholder="Email"></input>
                <input type="password" placeholder="Password"></input>
                <input type="password" placeholder="Re-enter password"></input>
                <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">Register</button>
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">Error message</div>

                <Link href={'/'} className="text-sm mt-3 text-right">
                    Already have an account? <u>Login!</u> 
                </Link>
            </form>
        </div>
    </div>);
}