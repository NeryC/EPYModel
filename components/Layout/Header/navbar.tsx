import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();
  const activeTabStyle = "border-b-2 border-lime1 text-lime1";

  return (
    <>
      <ul className="flex justify-center w-full px-1 pt-2 text-black font-gibson2 text-base col-span-2  md:col-end-6 lg:col-end-8 invisible lg:visible">
        <li
          className={`px-4 rounded-t cursor-pointer ${
            router.pathname == "/" && activeTabStyle
          }`}
          onClick={() => {
            
          }}
        >
          home
        </li>
        <li
          className={`px-4 rounded-t cursor-pointer ${
            router.pathname == "/Leaderboard" && activeTabStyle
          }`}
          onClick={() => {
            
          }}
        >
          leaderboard
        </li>
      </ul>
    </>
  );
};
