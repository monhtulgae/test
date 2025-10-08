import { FaStar } from "react-icons/fa";
import GraphArea from "../components/GraphArea";
import ListItem from "../components/ListItem";
import BackCoin from "../components/backButton";
import { config } from "@/config/index";

export default function GreenAsset() {
  return (
    <div className="text-black mx-auto rounded-2xl bg-color m-0">
      <BackCoin uri={`${config.apiBaseUrl}/`} />
      <div className="m-3 text-2xl w-3xl">Ногоон хөрөнгө</div>
      <GraphArea amount={32} interest={1} />
      <ListItem url="projects" />
    </div>
  );
};