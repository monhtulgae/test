import GraphArea from "../components/GraphArea";
import ListItem from "../components/ListItem";
import '../globals.css';
import BackCoin from "../components/backButton";
import { config } from "@/config";

export default function NGO() 
{
  return (
    <div className="text-black bg-color m-0">
      <BackCoin uri={`${config.apiBaseUrl}/`} />
      <div className="mt-1 ml-4 mb-4 text-2xl font-bold ">Сайн үйлс</div>
      <GraphArea amount={32} interest={-1} />
      <ListItem url="organizations" />
    </div>
  );
};