package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class RecommendReducerInit extends Reducer<Text, Text, Text, Text> {

	@Override
	// Our reduce method: reads all values associated with a given vertex.
	// If there is a fully defined edge with a start and end vertex, we collect
	// all ends which might be associated with the start point, and record the
	// rank of the start point. If there is only a start, this is a vertex with
	// no outbound edges, so we simply record its rank. This allows each vertex
	// to be aware of both its rank and neighbors. They need not be aware of
	// their neighbors' ranks, because a part of my "iter" implementation
	// handles informing all vertices of their neighbors ranks when they need
	// this information.
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {
		// Collect all neighbors into a delimited String.
		String neighbors = "";
		int numNeighbors = 0; // Adsorption needs the number of neighbors.
		for (Text neighbor : values) {
			if (!neighbor.toString().equals("none")) {
				numNeighbors++;
				neighbors += neighbor.toString() + ",";
			}
		}

		// If there are no neighbors, denote this with a "none"
		if (neighbors.length() == 0) {
			neighbors = "none";
		}

		// Emit the vertex, its rank, the number of neighbors, and its list of neighbors.
		context.write(key, new Text("1\t" + numNeighbors + "\t" + neighbors + "\t-"));
	}
}