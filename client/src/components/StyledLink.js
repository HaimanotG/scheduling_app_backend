import styled from 'styled-components';
import {Link} from 'react-router-dom';

const StyledLink = styled(Link)`
    :link,
    :visited,
    :active {
        color: var(--text-color);
    }

    :hover {
        opacity: 0.8;
        text-decoration: none;
    }
`;

export default StyledLink;