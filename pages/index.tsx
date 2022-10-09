import type { NextPage } from "next";
import useUser from "../lib/client/useUser";
import Input from "../components/input";
import { useForm } from "react-hook-form";
import Layout from "../components/layout";
import Button from "../components/button";
import useMutation from "../lib/client/useMutation";
import { useEffect } from "react";
import useSWR from "swr";
import { TweetResponse, TweetsResponse } from "@api/tweets";
import { username } from "../lib/client/utils";
import Icon from "../components/icon";
import { TweetLikeResponse } from "@api/tweets/likes";

interface TweetFormData {
  tweet: string;
}
interface TweetLikeFormData {
  tweetId: number;
}

const Home: NextPage = () => {
  const { user } = useUser();
  const userName = username(user?.email);
  const { register, handleSubmit, reset } = useForm<TweetFormData>();
  const [tweet, { loading, data }] = useMutation<
    TweetFormData,
    TweetResponse
  >("/api/tweets");
  const { data: allTweetsRes, mutate: allTweetsMutate } =
    useSWR<TweetsResponse>("/api/tweets");
  const tweets = allTweetsRes?.tweets;
  const onValid = (formData: TweetFormData) => {
    if (!loading) {
      tweet(formData);
      reset();
    }
  };
  const [toggleLikeMutate, {loading: toggleLikeUpdating}] = useMutation<TweetLikeFormData, TweetLikeResponse>(
    "/api/tweets/likes"
  );
  const toggleLike = (tweetId: number, currentlyILiked: boolean) => {
    if(toggleLikeUpdating) return;
    
    // update likes on ui
    allTweetsMutate((prev) => {
      return (
        prev &&
        prev.tweets && {
          ...prev,
          tweets: prev.tweets.map((t) => {
            return {
              ...t,
              ILiked: tweetId !== t.id ? t.ILiked : !currentlyILiked,
              _count: {
                likes:
                  tweetId !== t.id
                    ? t._count!.likes
                    : t._count!.likes + (currentlyILiked ? -1 : 1),
              },
            };
          }),
        }
      );
    }, false);
    // update likes on db
    toggleLikeMutate({
      tweetId,
    });
  };

  console.log(tweets);

  // Right after tweet success, update UI with new tweet.
  useEffect(() => {
    if (data?.ok) {
      allTweetsMutate((prev) => {
        return (
          prev &&
          prev.tweets && {
            ...prev,
            tweets: Array.from([data.tweet!]).concat(prev.tweets),
          }
        );
      });
    }
  }, [data]);

  return (
    <Layout>
      <div>
        {userName && (
          <>
            <p className="text-xl py-2">Hi! {userName}</p>
            <form onSubmit={handleSubmit(onValid)}>
              <Input
                type="text"
                placeholder="What's happening?"
                required
                name="tweet"
                register={register("tweet", { required: true })}
              />
              <div className="flex justify-end py-1">
                <div className="w-32">
                  <Button
                    disabled={loading}
                    icon="upload"
                    type="submit"
                    text={loading ? "Tweeting..." : "Tweet"}
                  />
                </div>
              </div>
            </form>
            <h1 className="text-2xl font-bold py-5">Tweets</h1>
            <ul>
              {tweets &&
                tweets.map((tweet, idx) => {
                  return (
                    <div key={idx}>
                      <li className="flex justify-start items-start">
                        <span className="font-semibold flex-1">
                          {tweet.user.email === user?.email
                            ? "ME"
                            : username(tweet.user.email)}
                        </span>
                        <span className="px-1">:</span>
                        <span className="flex-[4]">{tweet.message}</span>
                        <div className="w-12 flex justify-center items-center">
                          <div
                            onClick={() => {
                              toggleLike(tweet.id, tweet.ILiked || false);
                            }}
                            className="hover:text-theme hover:scale-105 cursor-pointer"
                          >
                            <Icon name="heart" size="s" fill={tweet.ILiked || false} />
                          </div>
                          {tweet._count?.likes || 0}
                        </div>
                      </li>
                    </div>
                  );
                })}
            </ul>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
