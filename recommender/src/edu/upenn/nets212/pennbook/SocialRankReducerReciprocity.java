package edu.upenn.nets212.pennbook;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class SocialRankReducerReciprocity extends
		Reducer<Text, Text, Text, Text> {

	@Override
	// Our reduce method: reads all pairs of vertices.
	// If a vertex pair contains duplicates, the edge is marked bidirectional.
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {
		// Store the already-seen neighbors in a list.
		List<String> seen = new ArrayList<String>();

		// For every neighbor, emit the representation of the edge with that
		// neighbor. If the neighbor has already been seen, emit an edge marked
		// bidirectional.
		for (Text neighbor : values) {
			if (!seen.contains(neighbor.toString())) {
				seen.add(neighbor.toString());
				context.write(key, new Text("\t" + neighbor.toString()));
			} else {
				context.write(new Text("b" + key.toString()), new Text("\t"
						+ neighbor.toString()));
			}
		}
	}
}