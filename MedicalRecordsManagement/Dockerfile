FROM openjdk:17
ARG FILE_JAR=target/*.jar

ADD ${FILE_JAR} MedicalRecordsManagement.jar
ENTRYPOINT ["java","-jar","MedicalRecordsManagement.jar"]
EXPOSE 8081