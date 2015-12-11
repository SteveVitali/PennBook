package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class SocialRankMapperReciprocity extends
		Mapper<LongWritable, Text, Text, Text> {

	@Override
	// Our map method: outputs intermediate key-value pairs of
	// Text-Text objects. It reads each file in our input
	// directory one line at a time. The corresponding reducer is meant to
	// mark all edges it finds to be bidirectional. This can then be counted by
	// another MapReduce job.
	public void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {
		// Split the line into an edge's endpoints.
		String line = value.toString();
		String[] ends = line.split("\t");

		// Per the description given in reciprocity.txt, the way edges are
		// detected is through duplicate values emitted to the same key. These
		// values are obtained by flipping the larger of our vertex-vertex pairs
		// before emitting.
		if (Integer.parseInt(ends[0]) > Integer.parseInt(ends[1])) {
			context.write(new Text(ends[1]), new Text(ends[0]));
		} else {
			context.write(new Text(ends[0]), new Text(ends[1]));
		}
	}
}