
#include <limits.h>

#define MAX_NODES 6

// Adjacency matrix
int graph[MAX_NODES][MAX_NODES] = {

    {0, 3, 2, 0, 0, 0},
    {3, 0, 0, 4, 0, 0},
    {2, 0, 0, 0, 2, 0},
    {0, 4, 0, 0, 0, 3},
    {0, 0, 2, 0, 0, 4},
    {0, 0, 0, 3, 4, 0}
};

int find_path(int start, int target, int *outPath)
{
    int dist[MAX_NODES];
    int visited[MAX_NODES] = {0};
    int previous[MAX_NODES];

    // Initialize arrays
    for (int i = 0; i < MAX_NODES; i++)
    {
        dist[i] = INT_MAX;
        previous[i] = -1;
    }

    dist[start] = 0;

    // Dijkstra algorithm
    for (int count = 0; count < MAX_NODES; count++)
    {
        int current = -1;
        int minDistance = INT_MAX;

        // Find minimum distance unvisited node
        for (int i = 0; i < MAX_NODES; i++)
        {
            if (!visited[i] && dist[i] < minDistance)
            {
                minDistance = dist[i];
                current = i;
            }
        }

        if (current == -1)
            break;

        visited[current] = 1;

        if (current == target)
            break;

        // Update neighboring nodes
        for (int i = 0; i < MAX_NODES; i++)
        {
            if (graph[current][i] > 0 && !visited[i])
            {
                int newDistance =
                    dist[current] + graph[current][i];

                if (newDistance < dist[i])
                {
                    dist[i] = newDistance;
                    previous[i] = current;
                }
            }
        }
    }

    if (dist[target] == INT_MAX)
        return 0;

    // Reconstruct path
    int reversePath[MAX_NODES];
    int pathLength = 0;

    int current = target;

    while (current != -1 && pathLength < MAX_NODES)
    {
        reversePath[pathLength++] = current;

        if (current == start)
            break;

        current = previous[current];
    }

    if (reversePath[pathLength - 1] != start)
        return 0;

    // Reverse the path
    for (int i = 0; i < pathLength; i++)
    {
        outPath[i] = reversePath[pathLength - 1 - i];
    }

    return pathLength;
}
