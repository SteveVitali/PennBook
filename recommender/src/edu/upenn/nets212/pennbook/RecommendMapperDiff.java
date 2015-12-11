package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class RecommendMapperDiff extends Mapper<LongWritable, Text, Text, Text> {

	@Override
	// Our map method: outputs intermediate key-value pairs of
	// Text-Text objects. It reads each file in our input
	// directory one line at a time. The corresponding reducer is meant to
	// calculate and store the absolute difference between two ranks of a
	// vertex. This can then be sorted by another MapReduce job.
	public void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {
		// Split the line into a vertex, rank, list of known values.
		String line = value.toString();
		String[] row = line.split("\t");
		String id = row[0];
		String rank = row[1];

		// Emit the vertex and its rank.
		context.write(new Text(id), new Text(id + "=" + rank));

		// If this vertex knows anything
		String known = row[4];
		if (!known.equals("-")) {
			// For each known value, emit the vertex and the score of that
			// value.
			String[] others = known.split(",");
			for (String other : others) {
				context.write(new Text(id), new Text(other));
			}
		}
	}
}