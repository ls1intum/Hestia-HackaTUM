# Hestia

## Getting Started

To get Hestia up and running, simply use Docker. Execute the following command in your terminal:

```
docker compose up
```

This will start all the necessary services defined in the Docker Compose file. Once the services are up and running, you can access the Hestia platform by navigating to https://localhost in your browser.

## Inspiration
The idea for Hestia was born out of a need for better information on suburban and urban living costs and infrastructure availability. As cities grow, it becomes crucial to provide a resource that helps residents and newcomers make informed decisions about where to live, what to budget for, and how to connect with critical infrastructure. We recognized that people moving from outside the city are often unfamiliar with the various suburbs and their unique characteristics, making it difficult for them to find the best fit for their needs without extensive research.

## What it does
Hestia provides a comprehensive map-based interface that supplies users with detailed information about suburban and urban areas. This includes pricing data, connectivity to essential infrastructure (such as hospitals, schools, and transportation), and other valuable insights to aid in decision-making. Additionally, we provide heatmaps for various aspects such as cost of living, accessibility, and safety. Users can also see a computed all-around score that summarizes the overall livability of different areas, making comparisons straightforward.

## How we built it
- Frontend: Developed using React to build a dynamic, responsive user interface.
- Mapping: Integrated Leaflet for interactive map rendering.
- APIs: Leveraged the Google Maps API for geographic data and the Munich API for localized information about infrastructure and services.
- Backend: Constructed to handle data aggregation, processing, and API communications efficiently using Kotlin and Quarkus. The backend is Docker-based, horizontally scalable, and built as a microservice architecture to ensure robust performance and scalability.

## Challenges we ran into
- Data Integration: Combining data from various APIs (Interhyp, Google, Munich, etc.) required careful handling to ensure consistency and accuracy.
- Mapping Complexity: Implementing detailed, interactive maps presented technical challenges, especially when ensuring performance and usability across different devices.
- User Interface Design: Crafting a UI that is both informative and intuitive took considerable iteration and feedback.

## Accomplishments that we're proud of
- Heatmaps and Scoring System: Developed heatmaps for different aspects and a computed all-around score for easy comparison of areas.
- User-Friendly Interface: Developed an interface that is easy to navigate, making complex data accessible to all users.
- Performance Optimization: Ensured that the platform runs smoothly, even with large datasets and high user engagement.

## What we learned
- API Management: Gained deeper insights into managing and integrating multiple third-party APIs.
- User Experience Focus: Emphasized the importance of UX design in making a data-intensive application user-friendly.
- Scalability Considerations: Understood the challenges and strategies involved in scaling an application that relies on real-time data updates and extensive user interaction.
- Microservices Architecture: Learned the benefits and challenges of implementing a scalable microservice-based architecture and how it can be effectively managed using Docker.
- Power of Teamwork: Appreciated the importance of collaboration and diverse skills in achieving our project goals.
- Google Cloud: Explored and utilized the capabilities of Google Cloud for scalability, deployment, and data management.
- New Web Frameworks: Gained experience with modern web frameworks and tools, enhancing our ability to implement cutting-edge technology.

## What's next for Hestia
- Expand Geographic Coverage: Broaden the platform to include more cities and suburban areas.
- Enhanced Data Insights: Incorporate additional data layers such as crime statistics, environmental quality, and real estate market trends.
- Mobile App Development: Develop a mobile version of Hestia to enhance accessibility and user experience on-the-go.
- User Customization: Allow users to personalize their map views based on their specific needs and preferences.
- Integration with Interhyp "BAUFINANZIERUNG": Facilitate users in their home financing journey by integrating Interhyp's "BAUFINANZIERUNG" features, offering tailored financing solutions directly within the platform.
