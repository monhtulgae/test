import GraphArea from "../components/GraphArea";
import ListItem from "../components/ListItem";
import '../globals.css';
import BackCoin from "../components/backButton";
import { config } from "@/config";

export default function NGO() 
{
  return (
    <div className="text-black w-full rounded-2xl bg-color m-0">
      <BackCoin uri={`${config.apiBaseUrl}/`} />
      <div className="m-3 text-2xl w-3xl">Сайн үйлс</div>
      <GraphArea amount={32} interest={-1} />
      <ListItem url="organizations" />
    </div>
  );
};