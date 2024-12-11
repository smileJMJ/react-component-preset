import { Fragment } from 'react/jsx-runtime';
import type { IDataItem } from '@rfc/hooks/useScheduleData';

const Item = ({ item }: { item: IDataItem }) => {
  const { title, description } = item ?? {};
  return (
    <div className="rfc-content-item">
      <h1>{title}</h1>
      {description ? <p>{description}</p> : <Fragment />}
    </div>
  );
};

const List = ({ data }: { data: IDataItem[][] }) => {
  return (
    <div className="rfc-content-list">
      {data?.map((depth1Data, i: number) => (
        <ul key={`category-${i}`}>
          {depth1Data?.map((depth2Data: IDataItem) => (
            <li key={`${depth2Data?.category}-${depth2Data?.title}`}>
              <Item {...{ item: depth2Data }} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default List;
