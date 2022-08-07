import AuthContextProvider from "./AuthContext";
import PostContextProvider from "./PostContext";
import ContactContextProvider from "./ContactContext";
import UserContextProvider from "./UserContext";
import VideoContextProvider from "./VideoContext";
import StudentContextProvider from "./StudentContext";
import CommentContextProvider from "./CommentContext";
import CategoryContextProvider from "./CategoryContext";
import QuestionContextProvider from "./QuestionContext";

function MainContext({ children }) {
  return (
    <AuthContextProvider>
      <PostContextProvider>
        <ContactContextProvider>
          <UserContextProvider>
            <VideoContextProvider>
              <StudentContextProvider>
                <CommentContextProvider>
                  <CategoryContextProvider>
                    <QuestionContextProvider>
                      {children}
                    </QuestionContextProvider>
                  </CategoryContextProvider>
                </CommentContextProvider>
              </StudentContextProvider>
            </VideoContextProvider>
          </UserContextProvider>
        </ContactContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
  );
}

export default MainContext;
