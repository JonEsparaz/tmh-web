
import React, { EventHandler, SyntheticEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import "./BlogItem.scss"
import * as customQueries from '../../graphql-custom/customQueries';
import Amplify, { API } from 'aws-amplify';
import awsmobile from '../../aws-exports';
import format from 'date-fns/format';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api/lib/types';
import { Helmet } from 'react-helmet';
import { Link, LinkButton } from 'components/Link/Link';

Amplify.configure(awsmobile);

type BlogData = {
    id: string;
    author: string;
    createdBy?: string;
    createdDate?: string;
    publishedDate: string;
    expirationDate?: string;
    blogStatus: string;
    description: string;
    blogTitle: string;
    createdAt: string;
    updatedAt?: string;
}

interface Props extends RouteComponentProps {
    content: any
}
interface State {
    content: any,
    listData: BlogData[],
    publishedOnly: BlogData[],
}
class BlogItem extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            content: props.content,
            listData: [],
            publishedOnly: [],
        }
        const getBlogByBlogStatus: any = API.graphql({
            query: customQueries.getBlogByBlogStatus,
            variables: { blogStatus: this.state.content.status, sortDirection: this.state.content.sortOrder, limit: this.state.content.limit },
            authMode: GRAPHQL_AUTH_MODE.API_KEY
        });
        getBlogByBlogStatus.then((json: any) => {
            console.log("Success queries.getBlogByBlogStatus: " + json);
            console.log(json)
            this.setState({
                listData: json.data.getBlogByBlogStatus.items
            })
            const today = format(new Date(), "yyyy-MM-dd")
            const dateChecked = this.state.listData.filter((post: any) => post.publishedDate <= today && (post.expirationDate >= today || post.expirationDate))
            this.setState({ publishedOnly: dateChecked })
            console.log(this.state.publishedOnly)
        }).catch((e: any) => { console.log(e) })
    }

    fallbackToImage(fallbackUrl: string): EventHandler<SyntheticEvent<HTMLImageElement>> {
        return function (event: SyntheticEvent<HTMLImageElement>) {
            if (!event.currentTarget.src.endsWith(fallbackUrl)) {
                event.currentTarget.src = fallbackUrl;
                event.currentTarget.srcset = '';
            }
        };
    }

    render() {
        if (this.state.publishedOnly === null) {
            return null;
        }
        if (this.state.content.style === "hero") {
            console.log(this.props.content.class)
            if (this.state.publishedOnly.length === 0) {
                return null
            }
            return (
                <div className="blog-item">
                    <div className="blog" >
                        <Helmet>
                            <meta property="og:url" content="https://www.themeetinghouse.com/blog" />
                            <meta property="og:title" content="The Meeting House - Blog" />
                            <meta property="og:description" content="" />
                            <meta property="og:type" content="website" />
                            <meta property="fb:app_id" content="579712102531269" />
                            <meta property="og:image" content={"https://www.themeetinghouse.com/static/photos/blogs/baby-hero/" + this.state.publishedOnly[0].blogTitle.replace(/\?|[']/g, "") + ".jpg"} />
                            <meta property="og:image:secure_url" content={"https://www.themeetinghouse.com/static/photos/blogs/baby-hero/" + this.state.publishedOnly[0].blogTitle.replace(/\?|[']/g, "") + ".jpg"} />
                            <meta property="og:image:type" content="image/jpeg" />

                            <meta property="twitter:title" content="The Meeting House - Blog" />
                            <meta property="twitter:creator" content="@TheMeetingHouse" />
                            <meta property="twitter:image" content={"https://www.themeetinghouse.com/static/photos/blogs/baby-hero/" + this.state.publishedOnly[0].blogTitle.replace(/\?|[']/g, "") + ".jpg"} />
                            <meta property="twitter:description" content="" />
                            <meta property="twitter:url" content="https://www.themeetinghouse.com/blog" />
                            <meta property="twitter:card" content="summary" />
                        </Helmet>
                        <h1 className="blog-h1" >{this.props.content.header1}</h1>
                        <div className="blog-blackbox" >
                            <div className="blog-post-title" >{this.state.publishedOnly[0].blogTitle}</div>
                            <div className="blogdiv blogauthor" >by <span className="author-underline">{this.state.publishedOnly[0].author}</span> on {this.state.publishedOnly[0].publishedDate}</div>
                            <div className="blogdiv blogdescription" >{this.state.publishedOnly[0].description}</div>
                            <div className="blogdiv2" >
                                <LinkButton size="lg" to={"/posts/" + this.state.publishedOnly[0].id}>Read More</LinkButton>
                            </div>
                            <div>
                                <Link to={"/posts/" + this.state.publishedOnly[0].id}>
                                    <img
                                        alt="TBD" className="blog-image-desktop"
                                        src={"/static/photos/blogs/baby-hero/" + this.state.publishedOnly[0].blogTitle.replace(/\?|[']/g, "") + ".jpg"}
                                        onError={this.fallbackToImage('/static/photos/blogs/baby-hero/fallback.jpg')}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="mobile-image-container">
                            <Link to={"/posts/" + this.state.publishedOnly[0].id}>
                                <img alt="TBD" className="blog-image-mobile"
                                    src={"/static/photos/blogs/baby-hero/" + this.state.publishedOnly[0].blogTitle.replace(/\?|[']/g, "") + ".jpg"}
                                    onError={this.fallbackToImage('/static/photos/blogs/baby-hero/fallback.jpg')} />
                            </Link>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.content.style === "twoImage") {
            console.log(this.props.content.class)
            if (this.state.publishedOnly.length === 0) {
                return null
            }
            return (
                <div className="blog-item">
                    <div className="blog twoImage" >
                        <h1 className="blog-h1 twoImage" >{this.props.content.header1}</h1>
                        {this.state.publishedOnly.slice(0, 2).map((item, index) => {
                            return (
                                <div key={index} className="BlogTwoImageItem">
                                    <Link to={"/posts/" + item.id}>
                                        <img alt={item.id + " series image"}
                                            className="BlogSquareImage twoImage"
                                            loading="lazy"
                                            src={"/static/photos/blogs/square/" + item.blogTitle.replace(/\?|[']/g, "") + ".jpg"}
                                            onError={this.fallbackToImage('/static/photos/blogs/square/fallback.jpg')} />
                                        <img alt={item.id + " series image"}
                                            className="BlogBannerImage twoImage"
                                            loading="lazy"
                                            src={"/static/photos/blogs/banner/" + item.blogTitle.replace(/\?|[']/g, "") + ".jpg"}
                                            onError={this.fallbackToImage('/static/photos/blogs/banner/fallback.jpg')} />
                                    </Link>
                                    <div className="BlogTwoImageTextContainer">
                                        <div className="blog-post-title twoImage">{item.blogTitle}</div>
                                        <div className="blogauthor twoImage">by <span className="author-only">{item.author}</span> on {item.publishedDate}</div>
                                        <div className="blogdescription twoImage">{item.description}</div>
                                        <Link className="blog-read-more" to={"/posts/" + item.id}>Read More</Link>
                                    </div>
                                </div>
                            )
                        }
                        )}
                        <LinkButton size="lg" className="inverted twoImageButton" to="/blog">View All Blogs</LinkButton>
                    </div>
                </div>
            );
        }
        else return null
    }
}

export default withRouter(BlogItem)
