import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className="flex justify-center h-screen">
            <div className="w-full h-full border-x border-indigo-800 md:max-w-2xl overflow-y-scroll ">
                {props.children}
            </div>
        </main>
    )
}