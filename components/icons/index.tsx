import Image from "next/image";
import BrilliantMoveImg from "/public/assets/icons/brilliant-move.png";
import GreatMoveImg from "/public/assets/icons/great-move.png";
import InaccuracyMoveImg from "/public/assets/icons/inacurracy-move.png";

type IconProps = {
    className?: string;
};

const BrilliantMove = ({ className }: IconProps) => (
    <Image src={BrilliantMoveImg} alt="Brilliant Move" width={24} height={24} className={className} />
);

const GreatMove = ({ className }: IconProps) => (
    <Image src={GreatMoveImg} alt="Great Move" width={24} height={24} className={className} />
);

const InaccuracyMove = ({ className }: IconProps) => (
    <Image src={InaccuracyMoveImg} alt="Inaccuracy Move" width={24} height={24} className={className} />
);

const Icons = {
    BrilliantMove,
    GreatMove,
    InaccuracyMove,
};

export default Icons;