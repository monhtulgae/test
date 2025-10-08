import GraphArea from "../components/GraphArea";
import ListItem from "../components/ListItem";
import '../globals.css';
import { FaStar } from 'react-icons/fa';

export default function NGO() 
{
  return (
    <div className="text-black w-full sm:w-[360px] mx-auto rounded-2xl bg-color m-0">
      <div className="flex justify-between p-3">
        <div>{"<Back"}</div>
        <div className="flex">
          <div className="text-green-400 bg-green-800 rounded-full p-1 flex mr-0.5">
            <FaStar></FaStar>
          </div>
          <span> 0</span>
        </div>
      </div>
      <div className="m-3 text-2xl w-3xl">Сайн үйлс</div>
      <GraphArea amount={32} />
      <ListItem />
    </div>
  );
};