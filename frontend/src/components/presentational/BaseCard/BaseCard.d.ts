import { FunctionComponent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import BaseCard from './BaseCard';

const propTypes = BaseCard.propTypes;

type BaseCardProps = InferProps<typeof propTypes>
// type BaseCardProps = {
//     asd: string;
// }

const BaseCard: FunctionComponent<BaseCardProps>;

export default BaseCard;
