export interface ITitleProps {
  title: string;
}

const Title = ({ title }: ITitleProps) => {
  return <h1 className="rcp-title">{title}</h1>;
};

export default Title;
