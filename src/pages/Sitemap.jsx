import { Link } from 'react-router-dom';

const Sitemap = () => {
    return (
        <div>
            <h1>Sitemap</h1>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sitemap;
