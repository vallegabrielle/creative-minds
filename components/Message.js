export default function Message({ children, avatar, username, description }) {
    return (
        <div className="bg-white p-8 border-b-2 rounded-lg font-light">
            <div className="flex items-center gap-3">
                <img src={avatar} alt="User profile photo" className="w-10 rounded-full" />
                <h2>
                    {username}
                </h2>
            </div>
            <div className="py-4 text-gray-700 text-">
                <p>
                    {description}
                </p>
            </div>
            {children}
        </div>
    );
}