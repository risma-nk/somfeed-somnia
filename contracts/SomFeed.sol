// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

    /**
     * @dev L RMN - SomFeed
     */

contract SomFeed is Ownable {
    uint256 public postCounter;
    uint256 public constant POST_FEE = 0.001 ether;

    struct Post {
        uint256 id;
        address author;
        string content;
        string imageCID;
        uint256 timestamp;
        uint256 likes;
    }

    struct Comment {
        address author;
        string content;
        string imageCID;
        uint256 timestamp;
    }

    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment[]) public comments;
    mapping(uint256 => mapping(address => bool)) public likes;

    event PostCreated(
        uint256 indexed id,
        address indexed author,
        string content,
        string imageCID,
        uint256 timestamp
    );

    event PostLiked(uint256 indexed postId, address indexed liker);
    event CommentAdded(
        uint256 indexed postId,
        address indexed author,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Creates a new post. Requires a payment of POST_FEE.
     * @param _content The text content of the post.
     * @param _imageCID The IPFS CID of the image associated with the post.
     */
    function createPost(string memory _content, string memory _imageCID) public payable {
        require(msg.value == POST_FEE, "SomFeed: Must send exactly 0.01 ether");
        require(bytes(_content).length > 0 || bytes(_imageCID).length > 0, "SomFeed: Post cannot be empty");

        uint256 newPostId = postCounter;
        posts[newPostId] = Post({
            id: newPostId,
            author: msg.sender,
            content: _content,
            imageCID: _imageCID,
            timestamp: block.timestamp,
            likes: 0
        });

        postCounter++;

        emit PostCreated(newPostId, msg.sender, _content, _imageCID, block.timestamp);
    }

    /**
     * @dev Adds a comment to a post.
     * @param _postId The ID of the post to comment on.
     * @param _content The text content of the comment.
     * @param _imageCID The IPFS CID of the image associated with the comment.
     */
    function commentOnPost(uint256 _postId, string memory _content, string memory _imageCID) public {
        require(_postId < postCounter, "SomFeed: Post does not exist");
        require(bytes(_content).length > 0 || bytes(_imageCID).length > 0, "SomFeed: Comment cannot be empty");

        Comment memory newComment = Comment({
            author: msg.sender,
            content: _content,
            imageCID: _imageCID,
            timestamp: block.timestamp
        });

        comments[_postId].push(newComment);

        emit CommentAdded(_postId, msg.sender, block.timestamp);
    }

    /**
     * @dev Likes a post. A user can only like a post once.
     * @param _postId The ID of the post to like.
     */
    function likePost(uint256 _postId) public {
        require(_postId < postCounter, "SomFeed: Post does not exist");
        require(!likes[_postId][msg.sender], "SomFeed: You have already liked this post");

        posts[_postId].likes++;
        likes[_postId][msg.sender] = true;

        emit PostLiked(_postId, msg.sender);
    }

    /**
     * @dev Returns all posts.
     * @return An array of all Post structs.
     */
    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCounter);
        for (uint256 i = 0; i < postCounter; i++) {
            allPosts[i] = posts[i];
        }
        return allPosts;
    }

    /**
     * @dev Returns all comments for a specific post.
     * @param _postId The ID of the post.
     * @return An array of all Comment structs for the post.
     */
    function getComments(uint256 _postId) public view returns (Comment[] memory) {
        return comments[_postId];
    }
    
    /**
     * @dev Allows the owner to withdraw the contract balance.
     */
    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "SomFeed: Transfer failed.");
    }
}