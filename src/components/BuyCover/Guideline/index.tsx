
import Mobile from './Mobile';

interface Guideline {
    start: boolean;
    setStart: (b: boolean) => void;
}

const Guideline = ({ start, setStart }: Guideline) => {
    return <Mobile
        start={start}
        setStart={setStart}
    />;
};


export default Guideline;
