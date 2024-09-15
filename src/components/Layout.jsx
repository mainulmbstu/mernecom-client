import { Helmet } from "react-helmet";

// eslint-disable-next-line react/prop-types
const Layout = ({children, title, description, keyword, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keyword} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <main>{children} </main>
    </div>
  );
};

Layout.defaultProps = {
  title: 'Ecommerce app',
  description: 'mern stack project',
  keyword: 'mern, node, react, vite, mongoose, mongoDB, express',
  author:'Mainul Hasan'
}



export default Layout;
