FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY . /app

# Compile Java program
RUN javac src/Main.java

# Run Java program with correct classpath
CMD ["java", "-cp", "src", "Main"]

###################
# Explanation:
#When you complie the java application .java files(Main.java) gets compiled and stored as .class files (Main.class)
#javac converts:  # Main.java  →  Main.class 
#By default, javac stores the .class file in the SAME directory as the .java file.
#So while running the java application we have to specify the classpath where the .class files are stored in our case it is inside the src folder 
#we can specitfy the classpath using -cp option
#-CP stands for classpath It tells Java:Where to search for .class files and libraries when running your program.

###################
# If you dont want to do this use the below dockerfile
###################

FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY src/Main.java /app 

# Compile Java program
RUN javac Main.java

# Run Java program
ENTRYPOINT ["java", "Main"]

###################
# Explanation:
#Here notice we are copying only the Main.java file so .class file will be created in the /app folder itself not inside src/Main.class and src/Main.java
#So while running the java application we dont need to specify the classpath here because the .class file is in the same directory where we are running the java command

















































